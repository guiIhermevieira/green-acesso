import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Input, Select } from 'antd';
const inter = Inter({ subsets: ['latin'] })

const { Search } = Input;
const defaultEndpoint = 'https://rickandmortyapi.com/api/character';

export async function getServerSideProps(){
  const res = await fetch(defaultEndpoint);
  const data = await res.json()
  return {
    props: {
      data
    }
  }
}

const options =[{
  label: 'human',
  value: 'human'
}]

export default function Home( { data }) {
  const {info, results: defaultResults = []} = data
  const [results, updateResults] = useState(defaultResults);
  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint,
  });

  const {current} = page;

  useEffect(() => {
    if (current === defaultEndpoint) return;

    async function request(){
      const res = await fetch(current)
      const nextData = await res.json();

      updatePage({
        current,
        ...nextData.info
      });

      if (!nextData.info?.prev) {
        updateResults(nextData.results);
        return
      }

      updateResults((prev: any) => {
        return [
          ...prev, 
          ...nextData.results
        ]
      });
    }

    request ();
  }, [current]);

  function handleLoadMore(){
    updatePage((prev: any) => {
      return {
        ...prev,
        current: page?.next
      }
    })
  }

  function handleSearchSubmit(e){
    e.preventDefault();

    const {currentTarget = {}} = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find(field => field.name === 'query');

    const value = fieldQuery.value || '';

    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`

    updatePage({
      current: endpoint
    });

  }
  return (
    <>
      <Head>
        <title>Rick and Morty Déx</title>
      </Head>
      <main className={styles.main}>
      <h1 className='title'> Rick and Morty Déx</h1>
        <form className='search' onSubmit={handleSearchSubmit}>
        <Search placeholder="Procure seu personagem aqui :)" onSearch={handleSearchSubmit} enterButton name='query' style={{width: 1000}}/>
        </form>
        <div className={styles.grid}>
          {results.map((result: { id: any; name: any; image: any}) => {
            const {id, name, image} = result; 
             return (
              <div className={styles.card} style={{width: 350}}>
              <Link href="character/[id]" as={`/character/${id}`}>
              <img src={image} alt={`${name}`}/>
              <h2 key={id} className={inter.className}>
                {name} <span>-&gt;</span>
              </h2>
              <p className={inter.className}>
              </p>
              </Link>
              </div>
            )
          })}

          <button onClick={handleLoadMore}>Carregar mais...</button>
          


        </div>
      </main>
    </>
  )
}
