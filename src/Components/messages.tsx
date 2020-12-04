
export const Message = (props: any) => {

  return (
    <div className='fixed mt-20 mr-5 top-0 right-0 flex flex-col '>
      {props.messages && props.messages.length > 0 && props.messages.map((m: any, i: any) => (
        <div key={i}>
          <div className={`font-bold mb-5 p-2 border-b-2 break-words rounded-lg opacity-50  
          ${m.success ? 'bg-green-600 border-black' : 'bg-red-600 border-black'}`}>
            {m.message}
            </div>
        </div>
      ))}
    </div>
  )
}
