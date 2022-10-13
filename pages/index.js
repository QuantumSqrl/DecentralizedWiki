import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from '../components/date';
import {useTheme} from 'next-themes'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {

  return (
    <Layout home>
      <Head>
        <title>WikiTechTree</title>
      </Head>
      <section className={utilStyles.headingXl}>
        WikiTechTree
      </section>
      <section className={utilStyles.headingMd}>
        <p>A decentralized wiki about technology — open-sourcing engineering while preserving human progress</p>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
      <div class="bg-clip-border p-6 bg-black-600 border-4">
        <h2 className={utilStyles.headingLg}>Articles</h2>
        <ul class="grid grid-cols-2 gap-4">
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
            </li>
          ))}
        </ul>
        </div>
      </section>
    </Layout>
  );
}
