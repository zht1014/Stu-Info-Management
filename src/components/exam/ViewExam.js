import React, { useEffect } from 'react';
import axios from 'axios';

const ViewExam = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/exam/list"); 
                console.log(response.data); 
            } catch (error) {
                console.log(error); 
            }
        };

        fetchData(); 
    }, []); 

    return (
        <div>
            <h1>Exam Data</h1>
            {/* 你可以在这里渲染 exam data */}
        </div>
    );
};

export default ViewExam;
