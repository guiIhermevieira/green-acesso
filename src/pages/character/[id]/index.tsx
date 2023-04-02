import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })

const defaultEndpoint = 'https://rickandmortyapi.com/api/character';

export async function getServerSideProps({query}){
  const {id} = query
  const res = await fetch(`${defaultEndpoint}/${id}`);
  const data = await res.json()
  return {
    props: {
      data
    }
  }
}

export default function Character( { data }) {
  const {name, image, gender, location, origin, species, status} = data;

  return (
    <>
    <Head>
        <title>{name}</title>
    </Head>
      <main className={styles.main}>
        <h1 className='title'> {name} </h1>
          <div className='profile'>
            <div className='profile-image'>
              <img src={image} alt={name}/>
            </div>
            <div className='profile-details'>
              <h2>Character Details</h2>
              <ul>
                <li>
                  <strong>Name:</strong> {name}
                </li>
                <li>
                  <strong>Status:</strong> {status}
                </li>
                <li>
                  <strong>Gender:</strong> {gender}
                </li>
                <li>
                  <strong>Location:</strong> {location?.name}
                </li>
                <li>
                  <strong>Originally from:</strong> {origin?.name}
                </li>
                <li>
                  <strong>Gender:</strong> {gender}
                </li>
                <li>
                  <strong>Espécie:</strong> {species}
                </li>
              </ul>
            </div>
          </div>
      </main>
    </>
  )
}
