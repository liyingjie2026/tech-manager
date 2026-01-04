#!/usr/bin/env python3
"""
批量修改01_create_tables.sql和02_complete_sample_data.sql中的create_by和update_by字段类型
将VARCHAR(100)改为BIGINT，将字符串值改为BIGINT值
"""

import re
import sys

def fix_01_sql():
    """修改01_create_tables.sql文件"""
    print("正在修改 01_create_tables.sql ...")
    
    with open('scripts/01_create_tables.sql', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 替换所有create_by和update_by的类型定义从VARCHAR(100)改为BIGINT
    content = re.sub(
        r"`create_by`\s+VARCHAR$$100$$\s+COMMENT\s+'创建人'",
        "`create_by` BIGINT COMMENT '创建人ID'",
        content
    )
    content = re.sub(
        r"`update_by`\s+VARCHAR$$100$$\s+COMMENT\s+'更新人'",
        "`update_by` BIGINT COMMENT '更新人ID'",
        content
    )
    
    # 同时处理其他变体
    content = re.sub(
        r"`create_by`\s+VARCHAR$$100$$",
        "`create_by` BIGINT",
        content
    )
    content = re.sub(
        r"`update_by`\s+VARCHAR$$100$$",
        "`update_by` BIGINT",
        content
    )
    
    with open('scripts/01_create_tables.sql', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✓ 01_create_tables.sql 修改完成")

def fix_02_sql():
    """修改02_complete_sample_data.sql文件中的INSERT语句"""
    print("正在修改 02_complete_sample_data.sql ...")
    
    with open('scripts/02_complete_sample_data.sql', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 将字符串类型的用户ID改为数字类型
    # 例如：'1' -> 1, '系统管理员' -> 1, '监管端管理员' -> 2
    
    # 替换常见的用户名称为用户ID
    user_mapping = {
        "'系统管理员'": "1",
        "'监管端管理员'": "2",
        "'机构管理员'": "3",
        "'专家用户'": "4",
        "'admin'": "1",
        "'supervisor'": "2",
        "'institution'": "3",
        "'expert'": "4",
    }
    
    for old_val, new_val in user_mapping.items():
        content = content.replace(old_val, new_val)
    
    # 将带引号的数字ID改为不带引号（BIGINT类型）
    # 例如：create_by = '1' -> create_by = 1
    content = re.sub(r"create_by\s*=\s*'(\d+)'", r"create_by = \1", content)
    content = re.sub(r"update_by\s*=\s*'(\d+)'", r"update_by = \1", content)
    
    with open('scripts/02_complete_sample_data.sql', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✓ 02_complete_sample_data.sql 修改完成")

def main():
    try:
        fix_01_sql()
        fix_02_sql()
        print("\n全部修改完成！")
        print("现在所有表的create_by和update_by字段都是BIGINT类型，与BaseEntity一致。")
        return 0
    except Exception as e:
        print(f"\n错误：{e}", file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(main())
