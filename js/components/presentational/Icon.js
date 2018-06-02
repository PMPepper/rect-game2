import React from 'react';





export default function Icon({icon}) {
  const tIcon = typeof(icon);

  if(tIcon === 'string') {
    return <i className={`fas fa-${icon}`}></i>
  }
}
