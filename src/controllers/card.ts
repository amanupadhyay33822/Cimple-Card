import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../DB/dbconfig.js";
import { randomUUID, randomBytes } from "crypto";

// Create a new card

// Adjust path as per your project structure
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const createCard: any = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const {
      title,
      jobTitle,
      companyName,
      location,
      templateType,
      cardName,
      qrCodeUrl,
      aboutUs,
      companySocialMediaLink,
      dateOfBirth,
      emails,
      phoneNumbers,
      youtubeVideoLink,
      additionalLink,
      bio,
      comanyAddress,
      emergencyEmail,
      emergencyName,
      emergencyNumber,
      emergencyRelationship,
      languageSpoken,
      profileImageUrl,
      headerImageUrl,
      gallery,
      gridType,
      instagramPost,
      instagramReel,
      services,
      socialMediaLink,
      testimonials,
      businessHours,
    } = req.body;

    console.log(req.body);

    // Validate required fields
    if (!title || !jobTitle || !companyName) {
      return res.status(400).json({
        success: false,
        error: "Title, jobTitle, and companyName are required.",
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    // Parse arrays if provided as strings
    const galleryArray = Array.isArray(gallery)
      ? gallery
      : JSON.parse(gallery || "[]");
    const instagramPostArray = Array.isArray(instagramPost)
      ? instagramPost
      : JSON.parse(instagramPost || "[]");
    const instagramReelArray = Array.isArray(instagramReel)
      ? instagramReel
      : JSON.parse(instagramReel || "[]");

    // Generate unique custom ID and URL
    const customId: string = randomBytes(16).toString("hex");
    const url = `http://localhost:3000/medical/${customId}`;
    const qrcodeurl = `http://localhost:3000/${user?.publicId}/${cardName}`;

    // Create the new card along with connected data
    const newCard = await prisma.card.create({
      data: {
        title,
        jobTitle,
        companyName,
        location,
        profileImageUrl: profileImageUrl || null,
        templateType,
        cardName: cardName || url,
        qrCodeUrl: qrcodeurl || null,
        aboutUs: aboutUs || null,
        gridType: gridType || null,
        dateOfBirth: dateOfBirth || null,
        emails: emails || [],
        phoneNumbers: phoneNumbers || [],
        headerImageUrl: headerImageUrl || null,
        youtubeVideoLink: youtubeVideoLink || [],
        additionalLink: additionalLink || null,
        bio: bio || null,
        companyAddress: comanyAddress || null,
        emergencyEmail: emergencyEmail || null,
        emergencyName: emergencyName || null,
        emergencyNumber: emergencyNumber || null,
        emergencyRelationship: emergencyRelationship || null,
        languageSpoken: languageSpoken || null,
        gallery: galleryArray,
        instagramPost: instagramPostArray,
        instagramReel: instagramReelArray,
        user: {
          connect: { id: userId },
        },
        services: {
          create: services.map((service: any) => ({
            name: service.name,
            imageUrl: service.imageUrl || null,
            serviceUrl: service.serviceUrl || null,
            description: service.description || null,
          })),
        },
        SocialMediaLink: {
          create: socialMediaLink.map((link: any) => ({
            platform: link.platform,
            url: link.url,
            iconUrl: link.iconUrl || null,
          })),
        },
        testimonials: {
          create: testimonials.map((testimonial: any) => ({
            name: testimonial.name,
            imageUrl: testimonial.imageUrl || null,
            description: testimonial.description,
            designation: testimonial.designation || null,
          })),
        },
        businessHours: {
          create: businessHours.map((business: any) => ({
            type: business.type,
            from: business.from,
            to: business.to,
          })),
        },
        companySocialMediaLink: {
          create: companySocialMediaLink.map((link: any) => ({
            platform: link.platform,
            url: link.url,
            iconUrl: link.iconUrl || null,
          })),
        },
      },
      include: {
        services: true,
        SocialMediaLink: true,
        companySocialMediaLink:true,
        testimonials: true,
        businessHours: true,
      },
    });

    res.status(201).json({
      success: true,
      card: newCard,
    });
  } catch (error: any) {
  
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all cards
export const getAllCards: any = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
    }

    // Fetch cards associated with the logged-in user
    const cards = await prisma.card.findMany({
      where: {
        userId: userId,
      },
      include: {
        services: true,
        testimonials: true,
        companySocialMediaLink: true,
        SocialMediaLink: true,
        businessHours: true,
      },
    });
    res.status(200).json({ success: true, cards });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a card by ID
export const getCardById: any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const card = await prisma.card.findUnique({
      where: { id: id },
      include: {
        services: true,
        testimonials: true,
        companySocialMediaLink: true,
        SocialMediaLink: true,
        businessHours: true,
      },
    });

    if (!card)
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });

    res.status(200).json({ success: true, card });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getCardDetails: any = async (req: Request, res: Response) => {
  try {
    const { publicId, name } = req.query;

    // Validate that at least one parameter is provided
    if (!publicId && !name) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide either 'publicId' or 'name' to fetch card details",
      });
    }

    // Validate the publicId
    if (publicId && typeof publicId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid 'publicId'. It should be a string.",
      });
    }

    // Fetch the user using publicId
    const user = publicId
      ? await prisma.user.findUnique({
          where: { publicId: publicId as string },
        })
      : null;

    if (publicId && !user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch card using name and user's ID
    const card = await prisma.card.findFirst({
      where: {
        AND: [
          name
            ? { cardName: { equals: name as string, mode: "insensitive" } }
            : {},
          publicId ? { userId: user?.id } : {},
        ],
      },
    });

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    res.status(200).json({ success: true, card });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a card
export const getServicesByCardId: any = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;

    // Find all services associated with the given cardId
    const services = await prisma.service.findMany({
      where: { cardId: cardId },
    });

    // If no services are found, return a 404 response
    if (!services || services.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No services found for this card" });
    }

    // Respond with the list of services
    res.status(200).json({ success: true, services });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCard: any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // Assuming req.user contains the logged-in user's ID

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Check if the card belongs to the logged-in user
    const card = await prisma.card.findUnique({
      where: { id: id },
    });

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    if (card.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot update this card",
      });
    }

    // Extract fields from the request body
    const {
      title,
      bio,
      phoneNumbers,
      emails,
      templateType,
      qrCodeUrl,
      aboutUs,
      instagramVideoLink,
      youtubeVideoLink,
      companySocialMediaLink,
      profileImageUrl,
      personalSocialMediaLinks,
      jobTitle,
      companyName,
      dateOfBirth,
      addresses,
    } = req.body;

    // Create a dynamic data object
    const updatedData: any = {};

    // Validate and add fields to the updatedData object only if they are provided
    if (title) updatedData.title = title;
    if (bio) updatedData.bio = bio;
    if (phoneNumbers) updatedData.phoneNumbers = phoneNumbers;
    if (emails) updatedData.emails = emails;
    if (templateType) updatedData.templateType = templateType;
    if (qrCodeUrl) updatedData.qrCodeUrl = qrCodeUrl;
    if (aboutUs) updatedData.aboutUs = aboutUs;
    if (instagramVideoLink) updatedData.instagramVideoLink = instagramVideoLink;
    if (youtubeVideoLink) updatedData.youtubeVideoLink = youtubeVideoLink;
    if (companySocialMediaLink)
      updatedData.companySocialMediaLink = companySocialMediaLink;
    if (profileImageUrl) updatedData.profileImageUrl = profileImageUrl;
    if (personalSocialMediaLinks)
      updatedData.personalSocialMediaLinks = personalSocialMediaLinks;
    if (jobTitle) updatedData.jobTitle = jobTitle;
    if (companyName) updatedData.companyName = companyName;

    // Convert dateOfBirth to a valid Date object if provided
    if (dateOfBirth) {
      const parsedDate = new Date(dateOfBirth);
      if (isNaN(parsedDate.getTime())) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid dateOfBirth format" });
      }
      updatedData.dateOfBirth = parsedDate;
    }

    if (addresses) updatedData.addresses = addresses;

    // Update the card with the dynamic fields
    const updatedCard = await prisma.card.update({
      where: { id: id },
      data: updatedData,
    });

    res.status(200).json({ success: true, card: updatedCard });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a card
export const deleteCard: any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // Get the logged-in user's ID from the request object

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find the card to check ownership
    const card = await prisma.card.findUnique({
      where: { id: id },
    });

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    // Check if the logged-in user is the owner of the card
    if (card.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this card",
      });
    }

    // Delete the card
    await prisma.card.delete({
      where: { id: id },
    });

    res
      .status(200)
      .json({ success: true, message: "Card deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
