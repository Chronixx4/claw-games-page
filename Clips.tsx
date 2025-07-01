import React, { useState } from 'react';

const Clips = ({ clips }) => {
    const [sortedClips, setSortedClips] = useState(clips);

    // Sortiert die Clips nach Datum (neueste zuerst)
    const sortByDate = () => {
        const sorted = [...sortedClips].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSortedClips(sorted);
    };

    return (
        <div>
            <button onClick={sortByDate}>Nach Datum sortieren</button>
            <div>
                {sortedClips.map(clip => (
                    <div key={clip.id}>
                        <h3>{clip.title}</h3>
                        <p>{clip.description}</p>
                        <p>{new Date(clip.date).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Clips;