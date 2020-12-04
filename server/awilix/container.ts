import { asValue, createContainer } from 'awilix'
import postModel from '../model/postModel'
import userModel from '../model/userModel'


const container = createContainer({
})

container.register({

    postModel: asValue(postModel),
    userModel: asValue(userModel),
    
})

export default container;