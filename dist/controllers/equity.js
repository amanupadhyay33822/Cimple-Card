import prisma from "../DB/dbconfig.js";
export const calculateEquity = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                availabilityHours: {
                    include: {
                        availableTimes: true, // Include available times
                    },
                },
            },
        });
        const fixedEquity = {
            founder: 30,
            coFounder: 20,
            performanceBased: 50,
        };
        const totalPerformanceScores = {};
        let totalScore = 0;
        // Calculate performance score for each user
        for (const user of users) {
            const loggedHours = user.totalHoursWorked;
            const tasksCompleted = user.tasksCompleted;
            // Calculate total availability hours if stored in relation
            // Calculate total availability hours from available times
            const availabilityHours = user.availabilityHours.reduce((total, ah) => {
                const totalAvailableTime = ah.availableTimes.reduce((timeTotal, availableTime) => {
                    // Calculate the duration in hours (if needed, convert to minutes or your preferred unit)
                    const startTime = new Date(availableTime.startTime).getTime();
                    const endTime = new Date(availableTime.endTime).getTime();
                    const duration = (endTime - startTime) / (1000 * 60 * 60); // Duration in hours
                    return timeTotal + duration;
                }, 0);
                return total + totalAvailableTime;
            }, 0) || 0; // Default to 0 if no available times
            const strategicContribution = user.equityPercentage;
            const leadershipScore = user.tasksCompleted;
            const performanceScore = loggedHours * 0.2 +
                tasksCompleted * 0.3 +
                availabilityHours * 0.1 +
                strategicContribution * 0.2 +
                leadershipScore * 0.2;
            totalPerformanceScores[user.id] = performanceScore;
            totalScore += performanceScore;
        }
        const equityAllocations = {};
        for (const user of users) {
            if (user.designation === "Founder") {
                equityAllocations[user.id] = fixedEquity.founder;
            }
            else if (user.designation === "CoFounder") {
                equityAllocations[user.id] = fixedEquity.coFounder;
            }
            else {
                const userPerformanceScore = totalPerformanceScores[user.id];
                equityAllocations[user.id] =
                    (userPerformanceScore / totalScore) * fixedEquity.performanceBased;
            }
        }
        // Update each user with their calculated equity percentage if it's defined
        for (const user of users) {
            const equityPercentage = equityAllocations[user.id];
            if (typeof equityPercentage === "number") {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { equityPercentage },
                });
            }
            else {
                console.error(`No equity allocation found for user with ID ${user.id}`);
            }
        }
        console.log("Equity allocation updated successfully", equityAllocations);
        return res.status(200).json({ equityAllocations: equityAllocations });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
// Get all users (founder, co-founder, partners) and include their availability hours and times
