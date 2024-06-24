import React from "react"
import { Link } from "react-router-dom"

import Layout from '../components/Layout'

function NotFound(){
    return(
        <Layout>
            <div className="container-box mt-20 overflow-auto min-h-[60vh] w-[80%] mx-auto p-5 relative">
                <div className="flex justify-center">
                    <div className="top-48 text-9xl absolute font-sans font-bold">
                        PAGE NOT FOUND
                        <div className="text-xl text-right py-5 text-blue-500">
                            <Link to="/dashboard"> <i className="fas fa-backward"></i> return to Dashboard </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default NotFound