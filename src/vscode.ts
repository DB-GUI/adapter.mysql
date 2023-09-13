import { TreeItem, TreeItemCollapsibleState } from 'vscode'
import { func_activate } from '@ppzp/dbgui_types/adapter/vscode'
import { adapter, Connection } from '.'
import { Connection_config } from './oo'
import img_icon from './icon.svg'

export
const activate: func_activate<Connection_config, Connection> = () => ({
  ...adapter,
  make_treeview(record, icon) {
    return { // MySQL connection element (level 1)
      get_item: () => // MySQL connection treeitem
        make_ti(record.name, true, 'a MySQL connection', img_icon)
      ,
      async get_children() { // MySQL database element list
        // 建立连接
        const conn = await adapter.make_conn(record.config)
        // 查询有哪些数据库
        const db_list = await conn.retrieve_db_list()
        return db_list.map(db_name =>
          ({ // MySQL database element (level 2)
            get_item: () => // MySQL database treeitem
              make_ti(db_name, true, 'a MySQL database', icon.database)
            ,
            async get_children() { // MySQL table element list
              const tb_list = await conn.retrieve_tb_list(db_name)
              return tb_list.map(tb_name =>
                ({ // MySQL table element (level 3)
                  get_item: () =>
                    make_ti(tb_name, false, 'a MySQL table', icon.table)
                })
              )
            }
          })
        )
      }
    }
  }
})

function make_ti(
  label: string,
  has_children: boolean,
  tooltip: string | null,
  icon: string | null
) {
  const item = new TreeItem(label, has_children
    ? TreeItemCollapsibleState.Collapsed
    : TreeItemCollapsibleState.None
  )
  if(tooltip)
    item.tooltip = tooltip
  if(icon)
    item.iconPath = icon
  return item
}