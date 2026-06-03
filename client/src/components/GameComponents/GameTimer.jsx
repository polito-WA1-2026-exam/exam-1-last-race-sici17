import React from 'react';
import { Card, ProgressBar, Badge } from 'react-bootstrap';
import "../../styles/timer.css";

const GameTimer = ({ timeLeft, totalTime = 90 }) => {
    const isUrgent = timeLeft <= 15;
    const progressPercentage = (timeLeft / totalTime) * 100;
    const variant = isUrgent ? 'danger' : timeLeft <= 45 ? 'warning' : 'success';

    return (
        <Card className="timer-card border-0 bg-transparent">
            <Card.Body className="p-0 text-center">
                <Badge
                    bg={variant}
                    className={`mb-2 fs-5 px-3 py-2 ${isUrgent ? 'animate-pulse' : ''}`}
                >
                    ⏱️ {timeLeft}s
                </Badge>
                <ProgressBar
                    now={progressPercentage}
                    variant={variant}
                    animated={isUrgent}
                    className="timer-progress"
                    style={{ height: '10px', minWidth: '130px' }}
                />
            </Card.Body>
        </Card>
    );
};

export default GameTimer;