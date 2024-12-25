'use client';
import React, { useEffect } from 'react';
import styles from './page.module.css';

const Time = () => {
  
  useEffect(() => {
    // Utility to select an element
    const $ = (selector) => document.querySelector(selector);
    
    // Element references
    const hour = $('.hour');
    const dot = $('.dot');
    const min = $('.min');
    const week = $('.week');
    
    let showDot = true;
    
    const update = () => {
      showDot = !showDot;
      const now = new Date();
      
      // Toggle the visibility of the dot
      if (showDot) {
        dot.classList.add(styles.Invisible);
      } else {
        dot.classList.remove(styles.Invisible);
      }
      
      // Update the time display
      hour.textContent = String(now.getHours()).padStart(2, '0');
      min.textContent = String(now.getMinutes()).padStart(2, '0');
      
      // Highlight the current day
      Array.from(week.children).forEach((ele) => {
        ele.classList.remove(styles.Active);
      });
      week.children[now.getDay()].classList.add(styles.Active);
    };
    
    // Start the interval to update the clock
    const intervalId = setInterval(update, 500);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.Main}>
      <div className={styles.DigitalClock}>
        <div className={`${styles.Week} week`}>
          <div className={styles.Active}>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>
        <div className={styles.Time}>
          <div className={`${styles.Hour} hour`}>12</div>
          <div className={`${styles.Dot} dot`}>:</div>
          <div className={`${styles.Min} min`}>05</div>
        </div>
      </div>
    </div>
  );
};

export { Time};
