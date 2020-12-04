import React from 'react'
import '../styles/style.scss'
import Header from '../Components/header/header'
import { connect } from 'react-redux'
import { ReactNode } from 'react';
import { Message } from './messages';

interface ILayoutProps {
  children?: ReactNode;
  messages?: [
    {
      message?: string;
      success?: boolean;
    }
  ]
}

const Layout = (props: ILayoutProps) => {
  return (
    <div className=''>
      <Header />
        {props.children}
      <Message messages={props.messages} />
</div>
  )
}

export default React.memo( connect((state: any) => ({
  messages: state.messages
}), {})(Layout));

