# -*- coding: utf-8 -*-
"""逐枪逐槽校验生成的 JSON 是否与 Excel 表格完全一致。"""
import json
import os
import re
from collections import defaultdict

import openpyxl

SRC = 'D:/桌面/武器配置表-基础数据.xlsx'
BASE = 'D:/VS Code/bf6-gunsmith-randomizer/src/data'

SLOT_MAP = {
    '枪口': 'muzzle', '枪管': 'barrel', '下握把': 'underbarrel', '弹匣': 'magazine',
    '弹药类型': 'ammo', '瞄具': 'sight', '瞄准镜附件': 'sight_attachment',
    '顶部配件': 'top', '右侧配件': 'rail', '左侧配件': 'left_rail', '人体工学': 'ergonomics',
}
CAT_COLS = {1: 'assault_rifle', 2: 'carbine', 3: 'submachine_gun',
            4: 'light_machine_gun', 5: 'dmr', 6: 'sniper_rifle', 7: 'shotgun'}

def norm_key(s):
    return re.sub(r'[^0-9a-z\u4e00-\u9fff]', '', s.lower())

wb = openpyxl.load_workbook(SRC, data_only=True)

# 武器表 -> 武器名
weapons_by_cat = defaultdict(list)
ws0 = wb['武器表']
for row in ws0.iter_rows(min_row=2):
    for c in row:
        if c.value and c.column in CAT_COLS:
            weapons_by_cat[CAT_COLS[c.column]].append(str(c.value).strip())

all_weapon_names = [n for names in weapons_by_cat.values() for n in names]
# 检查 norm_key 冲突
seen = {}
for n in all_weapon_names:
    k = norm_key(n)
    if k in seen:
        print('NORM_KEY 冲突: %r vs %r' % (seen[k], n))
    seen[k] = n
name_lookup = {norm_key(n): n for n in all_weapon_names}

# Excel 逐枪逐槽 (name, cost)
excel = {}   # 武器名 -> slot -> set((name,cost))
for ws in wb.worksheets:
    if ws.title == '武器表':
        continue
    weapon = name_lookup.get(norm_key(ws.title))
    if weapon is None:
        print('无法匹配 sheet: %r' % ws.title)
        continue
    slots = {}
    for c in ws[1]:
        if c.value is None:
            continue
        col_name = str(c.value).split('|')[0].strip()
        slot = SLOT_MAP.get(col_name)
        if not slot:
            print('未知槽位 %r in %s' % (col_name, weapon))
            continue
        items = set()
        for row in ws.iter_rows(min_row=2, min_col=c.column, max_col=c.column):
            v = row[0].value
            if v is None or '|' not in str(v):
                continue
            name = str(v).split('|')[0].strip()
            cost = int(float(str(v).split('|')[1].strip()))
            items.add((name, cost))
        slots[slot] = items
    excel[weapon] = slots

# JSON：附件 id -> (name,cost,slot)
att_by_id = {}
for f in os.listdir(os.path.join(BASE, 'attachments')):
    for a in json.load(open(os.path.join(BASE, 'attachments', f), encoding='utf-8')):
        att_by_id[a['id']] = (a['nameZh'], a['cost'], a['slot'])

# JSON：武器
json_weapons = {}
for f in os.listdir(os.path.join(BASE, 'weapons')):
    for w in json.load(open(os.path.join(BASE, 'weapons', f), encoding='utf-8')):
        json_weapons[w['nameZh']] = w

out = []
mismatches = 0

for weapon in all_weapon_names:
    ex = excel.get(weapon, {})
    jw = json_weapons.get(weapon)
    if jw is None:
        out.append('!! JSON 缺少武器 %s' % weapon)
        mismatches += 1
        continue
    jslots = {s['slot']: set() for s in jw['slots']}
    for s in jw['slots']:
        for aid in s['allowedAttachmentIds']:
            if aid not in att_by_id:
                out.append('!! %s 引用了未知附件 id %s' % (weapon, aid))
                mismatches += 1
                continue
            name, cost, slot = att_by_id[aid]
            jslots[s['slot']].add((name, cost))

    # 槽位集合对比
    ex_slots = set(ex.keys())
    j_slots = set(jslots.keys())
    for s in sorted(ex_slots - j_slots):
        out.append('  缺槽位 %s: %s' % (weapon, s)); mismatches += 1
    for s in sorted(j_slots - ex_slots):
        out.append('  多槽位 %s: %s' % (weapon, s)); mismatches += 1

    for slot in sorted(ex_slots & j_slots):
        ex_items = ex[slot]
        j_items = jslots[slot]
        # VSSM 枪管为有意注入
        extra = ex_items - j_items   # Excel 有，JSON 缺
        miss = j_items - ex_items    # JSON 有，Excel 缺
        if extra:
            for x in sorted(extra):
                out.append('  JSON 缺少 [%s] %s|%d (%s)' % (slot, x[0], x[1], weapon)); mismatches += 1
        if miss:
            for x in sorted(miss):
                out.append('  JSON 多出 [%s] %s|%d (%s)' % (slot, x[0], x[1], weapon)); mismatches += 1

out.append('')
out.append('武器总数: %d' % len(all_weapon_names))
out.append('JSON 武器数: %d' % len(json_weapons))
out.append('JSON 附件数: %d' % len(att_by_id))
out.append('差异数: %d' % mismatches)
if mismatches == 0:
    out.append('结果: 完全一致（逐枪逐槽与表格一致）')

open('_verify_result.txt', 'w', encoding='utf-8').write('\n'.join(out))
print('done, mismatches=', mismatches)
