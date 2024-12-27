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
    console.log(userId);
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
      linkedinLink,
      twitterLink,
      instagramLink,
      languageSpoken,
      otherEmails,
      profileImageUrl,
      otherPhoneNumber,
      phoneNumber,
      headerImageUrl,
      productDesc,
      facebookLink,
      gallery,
      gridType,
      instagramPost,
      instagramReel,
      services,
      socialMediaLink,
      testimonials,
      businessHours,
    } = req.body;

    // Validate required fields
    if (!title || !jobTitle || !companyName) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Title, jobTitle, and companyName are required.",
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

    // Handle optional fields
    const serviceObject = services
      ? {
          name: services.name,
          imageUrl: services.imageUrl,
          serviceUrl: services.serviceUrl,
        }
      : null;

    const socialMediaLinkObject = socialMediaLink
      ? {
          platform: socialMediaLink.platform,
          url: socialMediaLink.url,
          iconUrl: socialMediaLink.iconUrl,
        }
      : null;
    const businessLinkObject = businessHours
      ? {
          type: businessHours.type,
          from: businessHours.from,
          to: businessHours.to,
        }
      : null;
    const companySocialMediaLinkObject = companySocialMediaLink
      ? {
          platform: companySocialMediaLink.platform,
          url: companySocialMediaLink.url,
          iconUrl: companySocialMediaLink.iconUrl,
        }
      : null;

    const testimonialObject = testimonials
      ? {
          name: testimonials.name,
          imageUrl: testimonials.imageUrl,
          description: testimonials.description,
        }
      : null;

    // Generate unique custom ID and URL
    const customId: string = randomBytes(16).toString("hex");
    const url = `http://localhost:3000/medical/${customId}`;
    
    // if (req.file) {
    //   const result = await cloudinary.uploader.upload(req.file.path, {
    //     folder: "profile_images",
    //   });
    //   profileImageUrl = result.secure_url;
    // }
let qrcodeurl =`http://localhost:3000/${customId}/${cardName}`;
    // Create the new card in the database
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
        companySocialMediaLink: companySocialMediaLinkObject || null,
        dateOfBirth: dateOfBirth || null,
        emails: emails || null,
        phoneNumbers: phoneNumbers || null,
        headerImageUrl: headerImageUrl || null,
        youtubeVideoLink: youtubeVideoLink || null,
        additionalLink: additionalLink || null,
        bio: bio || null,
        comanyAddress: comanyAddress || null,
        emergencyEmail: emergencyEmail || null,
        emergencyName: emergencyName || null,
        emergencyNumber: emergencyNumber || null,
        emergencyRelationship: emergencyRelationship || null,
        linkedinLink: linkedinLink || null,
        twitterLink: twitterLink || null,
        instagramLink: instagramLink || null,
        languageSpoken: languageSpoken || null,
        otherEmails: otherEmails || null,
        otherPhoneNumber: otherPhoneNumber || null,
        phoneNumber: phoneNumber || null,
        productDesc: productDesc || null,
        facebookLink: facebookLink || null,
        gallery: galleryArray,
        instagramPost: instagramPostArray,
        instagramReel: instagramReelArray,
        services: serviceObject,
        SocialMediaLink: socialMediaLinkObject,
        testimonials: testimonialObject,
        businessHours:businessLinkObject,
        user: {
          connect: { id: userId },
        },
      }
    });


    res.status(201).json({ success: true, card: {
      ...newCard,
      services,
      socialMediaLink,
      testimonials,
      businessHours,
      companySocialMediaLink
    }, });
  } catch (error: any) {
    console.error(error);
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

    const card = await prisma.card.findUnique({ where: { id: id } });

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
    const { id, name } = req.params;

    // Validate that at least one parameter is provided
    if (!id && !name) {
      return res.status(400).json({
        success: false,
        message: "Please provide either 'id' or 'name' to fetch card details",
      });
    }

    // Fetch card using either id or name
    const card = await prisma.card.findFirst({
      where: name ? { id:id } : { cardName: name },
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
      return res
        .status(403)
        .json({
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
      return res
        .status(403)
        .json({
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