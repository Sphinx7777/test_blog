import React from "react";

let toTheTop = () => {
  window.scrollTo(0, 0);
};


export class ArrowUp extends React.PureComponent {

  state = {
    arrowUpShow: false
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event: any) => {

    let scrollTop = event.currentTarget.pageYOffset;
    if (scrollTop > 300) {
      this.setState({
        arrowUpShow: true
      });
    } else if (scrollTop < 300)
      this.setState({
        arrowUpShow: false
      });
  };

  render() {

    return (
      <div className=''
        onClick={(e) => e.stopPropagation()}>
        {
          this.state.arrowUpShow &&
          <img className='inline-block ml-2 cursor-pointer'
          src="/reply.png" 
          alt="to top" 
          title=''  
          onClick={toTheTop} />
        }
      </div>
    )
  }
}