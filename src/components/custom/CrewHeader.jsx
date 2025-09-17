import Image from "next/image";


const CrewHeader = ({data}) => {


    const {title, description, image} = data || {};

    return (
        <header className="text-white  text-center mb-20">
            <h1 className="text-4xl font-bold mb-10">{title}</h1>
            <div className="flex flex-col md:flex-row justify-center items-center mb-4 gap-8">
                <div className="w-full text-2xl text-left">{description}</div>
            </div>

        </header>
    )



}

export default CrewHeader;