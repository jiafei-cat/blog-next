import { NextPage } from "next"
import { useRouter } from "next/router"

const UserIndex: NextPage = () => {
  const router = useRouter()
  console.log(router)
  return (
    <section>
      {}个人中心
    </section>
  )
}

export default UserIndex