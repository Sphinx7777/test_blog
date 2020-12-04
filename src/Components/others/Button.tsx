

export const Button = (props: any) => (
  <button
    onClick={props.onClick}
    disabled={props.disabled}
    type={props.type}
  >
    {props.children}
    <style jsx>{`
        button {
          padding: 2px 5px;
          margin: 5px;
          background: ${props.background || 'white'};
          color: ${props.color || 'black'};
          display: inline-block;
          font-size: 1em;
          border-radius: 5px;
        }
        button:hover {
            cursor: pointer;
        }
     `}</style>
  </button>
)