import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../DB/dbconfig.js";
import { randomUUID, randomBytes } from 'crypto';


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
      companyName,
      companyAddress,
      jobTitle,
      bio,
      languageSpoken,
      dateOfBirth,
      phoneNumber,
      phoneNumbers,
      otherPhoneNumber,
      emails,
      otherEmails,
      emergencyName,
      emergencyRelationship,
      emergencyNumber,
      emergencyEmail,
      companySocialMediaLink,
      instagramLink,
      githubLink,
      additionalLink,
      productDesc,
      testimonialName,
      testimonialRole,
      testimonialIndustry,
      testimonialMessage,
      businesshoursFrom,
      businesshoursTo,
      businessType,
      templateType,
      aboutUs,
      qrCodeUrl,
      instagramVideoLink,
      youtubeVideoLink,
      services,
      SocialMediaLink,
    } = req.body;

    // Upload profile image to Cloudinary if provided
    let profileImageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_images",
      });
      profileImageUrl = result.secure_url;
    }

    const customId: string = randomBytes(16).toString("hex");
    const url = `http://localhost:3000/medical/${customId}`;

    const newCard = await prisma.card.create({
      data: {
        title,
        companyName: companyName || null,
        companyAddress: companyAddress || null,
        jobTitle: jobTitle || null,
        bio: bio || null,
        languageSpoken: languageSpoken || null,
        dateOfBirth: dateOfBirth || null,
        phoneNumber: phoneNumber || null,
        phoneNumbers: phoneNumbers || null,
        otherPhoneNumber: otherPhoneNumber || null,
        emails: emails || null,
        otherEmails: otherEmails || null,
        emergencyName: emergencyName || null,
        emergencyRelationship: emergencyRelationship || null,
        emergencyNumber: emergencyNumber || null,
        emergencyEmail: emergencyEmail || null,
        companySocialMediaLink: companySocialMediaLink || null,
        instagramLink: instagramLink || null,
        githubLink: githubLink || null,
        additionalLink: additionalLink || null,
        productDesc: productDesc || null,
        testimonialName: testimonialName || null,
        testimonialRole: testimonialRole || null,
        testimonialIndustry: testimonialIndustry || null,
        testimonialMessage: testimonialMessage || null,
        businesshoursFrom: businesshoursFrom || null,
        businesshoursTo: businesshoursTo || null,
        businessType: businessType || null,
        profileImageUrl,
        templateType,
        uniqueUrl: url,
        qrCodeUrl: qrCodeUrl || null,
        aboutUs: aboutUs || null,
        instagramVideoLink: instagramVideoLink || null,
        youtubeVideoLink: youtubeVideoLink || null,
        userId,
        services: {
          create: services?.map((service: any) => ({
            name: service.name,
            imageUrl: service.imageUrl,
            serviceUrl: service.serviceUrl,
          })) || [],
        },
        SocialMediaLink: {
          create: SocialMediaLink?.map((link: any) => ({
            platform: link.platform,
            url: link.url,
            iconUrl: link.iconUrl,
          })) || [],
        },
      },
    });

    res.status(201).json({ success: true, card: newCard });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

  
  // Get all cards
  export const getAllCards:any = async (req: Request, res: Response) => {
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
    } catch (error:any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  // Get a card by ID
  export const getCardById:any = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  


     const card = await prisma.card.findUnique({ where: { id: id } });

  
      if (!card) return res.status(404).json({ success: false, message: "Card not found" });
  
      res.status(200).json({ success: true, card });
    } catch (error:any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  // Update a card


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
      return res.status(404).json({ success: false, message: "Card not found" });
    }

    if (card.userId !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden: You cannot update this card" });
    }

    // Extract fields from the request body
    const {
      title, bio, phoneNumbers, emails, templateType, qrCodeUrl,
      aboutUs, instagramVideoLink, youtubeVideoLink, companySocialMediaLink,
      profileImageUrl, personalSocialMediaLinks, jobTitle, companyName,
      dateOfBirth, addresses,
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
    if (companySocialMediaLink) updatedData.companySocialMediaLink = companySocialMediaLink;
    if (profileImageUrl) updatedData.profileImageUrl = profileImageUrl;
    if (personalSocialMediaLinks) updatedData.personalSocialMediaLinks = personalSocialMediaLinks;
    if (jobTitle) updatedData.jobTitle = jobTitle;
    if (companyName) updatedData.companyName = companyName;

    // Convert dateOfBirth to a valid Date object if provided
    if (dateOfBirth) {
      const parsedDate = new Date(dateOfBirth);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ success: false, error: "Invalid dateOfBirth format" });
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
        return res.status(404).json({ success: false, message: "Card not found" });
      }
  
      // Check if the logged-in user is the owner of the card
      if (card.userId !== userId) {
        return res.status(403).json({ success: false, message: "You are not authorized to delete this card" });
      }
  
      // Delete the card
      await prisma.card.delete({
        where: { id: id },
      });
  
      res.status(200).json({ success: true, message: "Card deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
