import { createConnection } from 'mysql2'
import { Adapter, I_connection } from '@ppzp/dbgui_types/adapter'
import { Connection_config } from './oo'

export
interface Connection extends I_connection {
  db_selected: boolean
  retrieve_db_list(): Promise<string[]>
  retrieve_tb_list(db_name: string): Promise<string[]>
}

export
const adapter: Adapter<Connection_config, Connection> = {
  key: 'mysql',
  label: 'MySQL',
  make_conn({ database, ...config }) {
    const conn = createConnection({
      database: database || undefined,
      ...config
    })
    const db_selected = database !== null

    return {
      db_selected,
      async retrieve_db_list() {
        const [result] = await conn.query('show databases;')
        return []
      },
      async retrieve_tb_list(db_name) {
        await conn.query('use ' + db_name)
        const [result] = await conn.query('show tables;')
        return []
      }
    }
  },
  ui: {
    connection: {
      upsert: {
        form: [
          { key: 'host', label: 'Host', type: 'string' },
          { key: 'port', label: 'Port', type: 'number' },
          { key: 'user', label: 'User', type: 'string' },
          { key: 'password', label: 'Password', type: 'string' },
          { key: 'database', label: 'Database', type: 'string' },
        ]
      }
    }
  }
}
