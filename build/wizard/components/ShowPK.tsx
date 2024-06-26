import { server_config } from "../server_config";

interface Props {
    description?: string
}

const ShowPK = ({ description }: Props) => {

    const downloadBackup = () => {
        window.location.href = `${server_config.monitor_url}/wallet/pk`;
    }

    // return (
    //     <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
    //         <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
    //         <span>Download</span>
    //     </button>
    // )

    return (
        <button
            className="rounded-md bg-indigo-600 px-3 py-2 inline-flex items-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={downloadBackup}>
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
            <span>Show hot wallet private key</span>
        </button>
    );

}


export default ShowPK;