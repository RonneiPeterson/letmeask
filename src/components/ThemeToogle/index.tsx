import { useTheme } from "../../hooks/useTheme"

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useState } from "react";

export function ThemeToogle() {

    const {theme,toogleTheme}=useTheme();

    const [state,setState]=useState(()=>{
        const enabled= theme==='light'?false:true;
        return enabled;
    });
    
    function handleChange()
    {
        setState(!state);
        toogleTheme();
    }

    return (

        <FormControlLabel
        control={<Switch checked={state} onChange={handleChange} name="switchTheme" />}
        label="Dark Mode"
        />
        )


}


