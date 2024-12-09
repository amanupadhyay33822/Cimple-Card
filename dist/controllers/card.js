import prisma from "../DB/dbconfig.js";
import { randomBytes } from 'crypto';
// Create a new card
export const createCard = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, bio, phoneNumbers, emails, addresses, jobTitle, companyName, dateOfBirth, personalSocialMediaLinks, companySocialMediaLink, profileImageUrl, templateType, uniqueUrl, qrCodeUrl, aboutUs, instagramVideoLink, youtubeVideoLink, services, testimonials, SocialMediaLink, } = req.body;
        // Make sure personalSocialMediaLinks and SocialMediaLink have the expected structure
        const formattedPersonalSocialMediaLinks = personalSocialMediaLinks?.map((link) => ({
            platform: link.platform,
            url: link.url,
            iconUrl: link.iconUrl,
        }));
        const formattedSocialMediaLink = SocialMediaLink?.map((link) => ({
            platform: link.platform,
            url: link.url,
            iconUrl: link.iconUrl,
        }));
        const customId = randomBytes(16).toString('hex');
        const url = `http://localhost:3000/medical/${customId}`;
        const newCard = await prisma.card.create({
            data: {
                title,
                bio,
                phoneNumbers,
                emails,
                addresses,
                jobTitle,
                companyName,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                personalSocialMediaLinks: {
                    create: formattedPersonalSocialMediaLinks,
                },
                companySocialMediaLink,
                profileImageUrl,
                templateType,
                uniqueUrl: url,
                qrCodeUrl,
                aboutUs,
                instagramVideoLink,
                youtubeVideoLink,
                services: {
                    create: services?.map((service) => ({
                        name: service.name,
                        imageUrl: service.imageUrl,
                        serviceUrl: service.serviceUrl,
                    })),
                },
                testimonials: {
                    create: testimonials?.map((testimonial) => ({
                        authorName: testimonial.authorName,
                        content: testimonial.content,
                        designation: testimonial.designation,
                    })),
                },
                SocialMediaLink: {
                    create: formattedSocialMediaLink,
                },
                userId,
            },
        });
        res.status(201).json({ success: true, card: newCard });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// Get all cards
export const getAllCards = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized user" });
        }
        // Fetch cards associated with the logged-in user
        const cards = await prisma.card.findMany({
            where: {
                userId: userId,
            },
        });
        res.status(200).json({ success: true, cards });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// Get a card by ID
export const getCardById = async (req, res) => {
    try {
        const { id } = req.params;
        const card = await prisma.card.findUnique({ where: { id: parseInt(id) } });
        if (!card)
            return res.status(404).json({ success: false, message: "Card not found" });
        res.status(200).json({ success: true, card });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// Update a card
export const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id; // Assuming req.user contains the logged-in user's ID
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        // Check if the card belongs to the logged-in user
        const card = await prisma.card.findUnique({
            where: { id: parseInt(id) },
        });
        if (!card) {
            return res.status(404).json({ success: false, message: "Card not found" });
        }
        if (card.userId !== userId) {
            return res.status(403).json({ success: false, message: "Forbidden: You cannot update this card" });
        }
        // Extract fields from the request body
        const { title, bio, phoneNumbers, emails, templateType, qrCodeUrl, aboutUs, instagramVideoLink, youtubeVideoLink, companySocialMediaLink, profileImageUrl, personalSocialMediaLinks, jobTitle, companyName, dateOfBirth, addresses, } = req.body;
        // Create a dynamic data object
        const updatedData = {};
        // Validate and add fields to the updatedData object only if they are provided
        if (title)
            updatedData.title = title;
        if (bio)
            updatedData.bio = bio;
        if (phoneNumbers)
            updatedData.phoneNumbers = phoneNumbers;
        if (emails)
            updatedData.emails = emails;
        if (templateType)
            updatedData.templateType = templateType;
        if (qrCodeUrl)
            updatedData.qrCodeUrl = qrCodeUrl;
        if (aboutUs)
            updatedData.aboutUs = aboutUs;
        if (instagramVideoLink)
            updatedData.instagramVideoLink = instagramVideoLink;
        if (youtubeVideoLink)
            updatedData.youtubeVideoLink = youtubeVideoLink;
        if (companySocialMediaLink)
            updatedData.companySocialMediaLink = companySocialMediaLink;
        if (profileImageUrl)
            updatedData.profileImageUrl = profileImageUrl;
        if (personalSocialMediaLinks)
            updatedData.personalSocialMediaLinks = personalSocialMediaLinks;
        if (jobTitle)
            updatedData.jobTitle = jobTitle;
        if (companyName)
            updatedData.companyName = companyName;
        // Convert dateOfBirth to a valid Date object if provided
        if (dateOfBirth) {
            const parsedDate = new Date(dateOfBirth);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ success: false, error: "Invalid dateOfBirth format" });
            }
            updatedData.dateOfBirth = parsedDate;
        }
        if (addresses)
            updatedData.addresses = addresses;
        // Update the card with the dynamic fields
        const updatedCard = await prisma.card.update({
            where: { id: parseInt(id) },
            data: updatedData,
        });
        res.status(200).json({ success: true, card: updatedCard });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// Delete a card
export const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id; // Get the logged-in user's ID from the request object
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        // Find the card to check ownership
        const card = await prisma.card.findUnique({
            where: { id: parseInt(id) },
        });
        if (!card) {
            return res.status(404).json({ success: false, message: "Card not found" });
        }
        // Check if the logged-in user is the owner of the card
        if (card.userId !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this card" });
        }
        // Delete the card
        await prisma.card.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ success: true, message: "Card deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
