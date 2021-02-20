import React from 'react';

export default function Dashboard({ user, token }) {
    return (
        <>
            <h1>Dashboard Page</h1>
            <p>congrats on being logged in {user.username}. the dashboard will go here.</p>
        </>
    );
}