import '../../styles/style.scss'
import { useDispatch } from 'react-redux'
import { getAllPostsAC } from '../others/utilities/action'


const SearchForm = () => {
    const dispatch = useDispatch()
    const searchHandler = (event: any) => {
        const data = {
            name: event.target.name, value: event.target.value
        }
        dispatch(getAllPostsAC({ data }));
    }


    return (
        <div className='flex flex-wrap justify-around pt-2 '>
            <div>Search</div>
            <div>
                <span className='px-2'>Title</span>
                <input type="text" name='title' onChange={searchHandler} />
            </div>
            <div>
                <span className='px-2'>Author</span>
                <input type="text" name='fullName' onChange={searchHandler} />
            </div>
        </div>
    )
}

export default SearchForm






