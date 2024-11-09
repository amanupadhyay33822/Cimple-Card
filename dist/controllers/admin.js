import prisma from "../DB/dbconfig.js"; // Adjust the path based on your project structure
export const overrideScores = async (req, res) => {
    const { userId, newLeadershipScore, newStrategicContribution } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: {
                leadershipScore: newLeadershipScore, // Now it exists in the User schema
                strategicContribution: parseFloat(newStrategicContribution), // Now it exists in the User schema
            },
        });
        return res.status(200).json({ message: "Scores updated successfully", user: updatedUser });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
