function OptionCard({children, handleClick}) {
    return ( 
        <div className="option-card" onClick={handleClick}>
            {children}
        </div>
     );
}

export default OptionCard;