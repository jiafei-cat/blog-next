import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User, UserAuth, Articles, Comments, Tag } from './entity'
const {
  DATABASE_TYPE: type,
  DATABASE_HOST: host,
  DATABASE_PORT: port,
  DATABASE_USERNAME: username,
  DATABASE_PASSWORD: password,
  DATABASE_DATABASE: database,
} = process.env
let db:DataSource | null = null
async function getConnection () {
  console.log(!!db)
  if (db) {
    return db
  }

  const dataSource = new DataSource({
    type: type as 'mysql',
    host,
    port: Number(port),
    username,
    password,
    database,
    entities: [User, UserAuth, Articles, Comments, Tag],
    synchronize: false,
    logging: false,
    extra: {
      max: 10
    }
  })
  
  db = await dataSource.initialize()
  return dataSource
}

export default getConnection