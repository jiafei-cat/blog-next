import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User, UserAuth, Articles } from './entity'
const {
  DATABASE_TYPE: type,
  DATABASE_HOST: host,
  DATABASE_PORT: port,
  DATABASE_USERNAME: username,
  DATABASE_PASSWORD: password,
  DATABASE_DATABASE: database,
} = process.env

async function getConnection () {
  const dataSource = new DataSource({
    type: type as 'mysql',
    host,
    port: Number(port),
    username,
    password,
    database,
    entities: [User, UserAuth, Articles],
    synchronize: false,
    logging: false,
  })
  
  await dataSource.initialize()
  return dataSource
}

export default getConnection