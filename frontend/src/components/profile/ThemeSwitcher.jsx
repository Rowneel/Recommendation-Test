  import React, { useEffect } from "react";

  function ThemeSwitcher() {
      function setTheme(theme) {
          document.documentElement.setAttribute('data-theme', theme);
          localStorage.setItem('theme', theme);
        }

      useEffect(()=>{
        
      })

    return (
      <div className="flex space-x-2">
        <button
          onClick={() => setTheme("retro")}
          className="bg-primary text-text py-1 px-2 rounded"
        >
          Retro
        </button>
        <button
          onClick={() => setTheme("cyberpunk")}
          className="bg-primary text-text py-1 px-2 rounded"
        >
          Cyberpunk
        </button>
      </div>
    )
  }

  export default ThemeSwitcher;
