import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../DB/dbconfig.js";



// Create a new card
export const createCard:any = async (req: Request, res: Response) => {
    try {
      const {
        title,
        bio,
        phoneNumbers,
        emails,
        addresses,
        jobTitle,
        companyName,
        dateOfBirth,
        personalSocialMediaLinks,
        companySocialMediaLink,
        profileImageUrl,
        templateType,
        uniqueUrl,
        qrCodeUrl,
        aboutUs,
        instagramVideoLink,
        youtubeVideoLink,
        userId,
      } = req.body;
  
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
          personalSocialMediaLinks,
          companySocialMediaLink,
          profileImageUrl,
          templateType,
          uniqueUrl,
          qrCodeUrl,
          aboutUs,
          instagramVideoLink,
          youtubeVideoLink,
          userId,
        },
      });
  
      res.status(201).json({ success: true, card: newCard });
    } catch (error:any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  // Get all cards
  export const getAllCards:any = async (req: Request, res: Response) => {
    try {
      const cards = await prisma.card.findMany();
      res.status(200).json({ success: true, cards });
    } catch (error:any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  // Get a card by ID
  export const getCardById:any = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      const card = await prisma.card.findUnique({ where: { id: parseInt(id) } });
  
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
      const { 
        title, bio, phoneNumbers, emails, templateType, qrCodeUrl, 
        aboutUs, instagramVideoLink, youtubeVideoLink, companySocialMediaLink, 
        profileImageUrl, personalSocialMediaLinks, jobTitle, companyName, 
        dateOfBirth, addresses 
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
          return res.status(400).json({ success: false, error: 'Invalid dateOfBirth format' });
        }
        updatedData.dateOfBirth = parsedDate;
      }
  
      if (addresses) updatedData.addresses = addresses;
  
      // Update the card with the dynamic fields
      const updatedCard = await prisma.card.update({
        where: { id: parseInt(id) },
        data: updatedData,
      });
  
      res.status(200).json({ success: true, card: updatedCard });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  // Delete a card
  export const deleteCard:any = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      await prisma.card.delete({ where: { id: parseInt(id) } });
  
      res.status(200).json({ success: true, message: "Card deleted successfully" });
    } catch (error:any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  