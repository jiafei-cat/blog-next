import Head from 'next/head'
import { useRouter } from 'next/router'

const TagPage: NextPageWithPageConfig = () => {
  const router = useRouter()
  const { query } = router
  return (
    <section>
      <Head>
        <title>{query?.tag}</title>
      </Head>
    </section>
  )
}

TagPage.layout = {
  tagListBar: true
}

export default TagPage