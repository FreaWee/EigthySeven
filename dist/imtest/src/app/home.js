"use client";
import React, { useState, useEffect, useMemo } from "react";
import clsx from "clsx"; // Optional: for cleaner className handling
function Button({ text, handleClick, isActive = false, className, }) {
    return (<button type="button" onClick={handleClick} className={clsx("btn min-h-[50px] w-[120px] p-1 text-white text-md border rounded-lg ease-in duration-200 flex justify-center items-center", isActive
            ? "bg-blue-600 border-white"
            : "bg-[#325084] hover:bg-blue-400 border-[#325084]", className)}>
      {text}
    </button>);
}
export default function Home() {
    const [data, setData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [showCategoryButtons, setShowCategoryButtons] = useState(false);
    const [showDriverButtons, setShowDriverButtons] = useState(false);
    const [activeCategory, setActiveCategory] = useState("");
    const [error, setError] = useState(null);
    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                console.log("API URL utilisée :", apiUrl); // Débogage
                const response = await fetch(`${apiUrl}/api`);
                if (!response.ok) {
                    throw new Error(`Erreur lors de la récupération des données : ${response.status} - ${response.statusText}`);
                }
                const jsonData = await response.json();
                const formattedData = Object.keys(jsonData).map((key) => ({
                    id: key,
                    ...jsonData[key],
                }));
                setData(formattedData);
                setError(null);
            }
            catch (error) {
                console.error("Erreur lors du fetch des données :", error.message);
                setError("Impossible de charger les données. Veuillez réessayer plus tard.");
            }
        };
        fetchData();
    }, []);
    // Filter startups by type "Startup"
    const handleStartupClick = () => {
        const startups = data.filter((item) => item.typeOfMember.includes("Startup"));
        setFilteredData(startups);
        setShowCategoryButtons(true);
        setShowDriverButtons(false);
        setSelectedCategory("");
        setActiveCategory("");
    };
    // Filter startups by category
    const handleCategoryClick = (category) => {
        const filteredByCategory = data
            .filter((item) => item.typeOfMember.includes("Startup"))
            .filter((item) => item.category.includes(category));
        setFilteredData(filteredByCategory);
        setSelectedCategory(category);
        setShowDriverButtons(false);
        setActiveCategory(category);
    };
    // Filter by innovation driver
    const handleDriverClick = (driver) => {
        const filteredByDriver = data
            .filter((item) => item.typeOfMember.includes("Startup"))
            .filter((item) => item.category.includes(selectedCategory))
            .filter((item) => item.innovationDriver.includes(driver));
        setFilteredData(filteredByDriver);
    };
    // Memoize categories for performance
    const categories = useMemo(() => [
        "Finance & Invest",
        "Design & Build",
        "Market & Transact",
        "Manage & Operate",
        "Live & Work",
    ], []);
    return (<div className="m-0 bg-[url('/back.png')] bg-cover bg-no-repeat h-screen w-full flex justify-center">
      <div className="flex flex-col min-h-screen justify-start max-w-full">
        {/* Startup Button */}
        <div className="flex justify-center mt-6">
          <Button text="Startups" handleClick={handleStartupClick}/>
        </div>

        {/* Category Buttons */}
        {showCategoryButtons && (<div className="w-[1080px] mt-6 max-h-[50px] grid grid-cols-5 gap-16">
            {categories.map((category) => (<div key={category} className="flex flex-col items-center">
                <Button text={category} handleClick={() => handleCategoryClick(category)} isActive={activeCategory === category}/>
                {showDriverButtons && selectedCategory === category && (<div className="mt-6 flex gap-4">
                    <Button text="Efficiency" handleClick={() => handleDriverClick("Efficiency")}/>
                    <Button text="User Experience" handleClick={() => handleDriverClick("User-Centricity")}/>
                  </div>)}
              </div>))}
          </div>)}

        {/* Filtered Results */}
        <div className="grid grid-cols-3 mt-10 bg-blue-400/50 border border-blue-200 gap-10 rounded-lg p-2">
          {filteredData.length > 0 ? (filteredData.map((item) => {
            const websiteUrl = item.website.startsWith("http")
                ? item.website
                : `https://${item.website}`;
            return (<div key={item.id} className="text-[#325084] text-xl">
                  <ul>
                    <li className="flex justify-center">
                      <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                        <img className="h-12 hover:animate-pulse" src={item.logo[0]?.url || "/placeholder-logo.png"} alt={item.companyName}/>
                      </a>
                    </li>
                  </ul>
                </div>);
        })) : (<p className="text-center text-red-500 mt-4 col-span-3"></p>)}
        </div>
      </div>
    </div>);
}
