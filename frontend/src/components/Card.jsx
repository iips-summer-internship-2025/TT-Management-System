export default function Card({ icon: Icon, heading, title,iconColor }) {
  return (
    <div className="rounded-2xl shadow-2xl ">
      <div className={`flex p-2 rounded-2xl justify-center gap-1 flex-wrap md:px-10 md:py-4 `}>
        <div >
          <Icon className={`text-3xl p-2 text-center rounded-2xl text-white md:p-4 md:text-6xl  ${iconColor}`} />
        </div>
        <div className="flex flex-col justify-center items-center md:items-baseline">
          <h1 className="text-md font-bold md:text-3xl">{heading}</h1>
          <p className="text-xs md:text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
}
