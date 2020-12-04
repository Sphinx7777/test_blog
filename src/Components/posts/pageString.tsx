

import '../../styles/style.scss'
import { Map } from 'immutable';
// import Link from 'next/link'

interface IPageStringProps {
  pagination?: Map<string, any>;
}


export const PageString = ({ pagination }: IPageStringProps) => {
  const count = pagination && pagination.getIn(['posts', 'count'])
  const perPage = pagination.getIn(['posts', 'perPage'])
  const currentPage = pagination.getIn(['posts', 'currentPage'])


  const totalCountPages = Math.ceil(count / perPage);
  const countPages = [];
  for (let i = 1; i <= totalCountPages; i++) {
    countPages.push(i);
  }
  const pagesCount = countPages.filter(p => {
    return (p >= currentPage - 5 && p <= currentPage + 5);
  });
  const stringPages = () => pagesCount.map((n, index) => {
    return (
      <span
        key={index}
        className={currentPage === n
          ? 'text-red-500 px-2'
          : 'text-green-500 px-2'}>
        {n}
      </span>
    )
  });


  return (
    <>
      
      {countPages && countPages.length ? <div>{stringPages()}</div> : <div className='invisible'>xxx</div>}
     
      
    </>
  )
}