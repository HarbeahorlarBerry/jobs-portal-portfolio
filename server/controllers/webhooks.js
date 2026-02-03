import { Webhook } from "svix";
import User from "../models/User.js";

/**
 * Clerk Webhook Controller
 * Handles user creation, updates, and deletion synced from Clerk.
 */
export const clerkWebhooks = async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error("Error: CLERK_WEBHOOK_SECRET is not defined in .env");
      return res.status(500).json({ success: false, message: "Server configuration error" });
    }

    // Initialize Svix with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    // Verify the headers and the RAW body
    // req.body must be a Buffer or string (handled by express.raw in server.js)
    const payload = req.body.toString();
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    let evt;

    try {
      evt = wh.verify(payload, headers);
    } catch (verifyErr) {
      console.error("Verification failed:", verifyErr.message);
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Extract data and type from the verified event
    const { data, type } = evt;

    // Helper: Clean up name to avoid "null" strings
    const firstName = data.first_name || "";
    const lastName = data.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim() || "User";

    switch (type) {
      case "user.created":
      case "user.updated": {
        // We use findOneAndUpdate with upsert:true so that even if events 
        // arrive out of order, the database remains consistent.
        await User.findOneAndUpdate(
          { clerkId: data.id },
          {
            clerkId: data.id,
            email: data.email_addresses?.[0]?.email_address,
            name: fullName,
            image: data.image_url,
            // Only initialize resume if it's a brand-new creation
            ...(type === "user.created" && { resume: "" }),
          },
          { 
            upsert: true, 
            new: true, 
            runValidators: true 
          }
        );
        console.log(`User ${type === "user.created" ? "created" : "updated"}: ${data.id}`);
        break;
      }

      case "user.deleted": {
        await User.findOneAndDelete({ clerkId: data.id });
        console.log(`User deleted: ${data.id}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event type: ${type}`);
        break;
    }

    // Always send a 200 response to Clerk to acknowledge receipt
    return res.status(200).json({ success: true, message: "Webhook processed" });

  } catch (error) {
    console.error("Internal Webhook Error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



// import { Webhook } from "svix";
// import User from "../models/User.js";

// // Clerk Webhook Controller
// export const clerkWebhooks = async (req, res) => {
//   let event;

//   try {
//     // Create Svix webhook instance using Clerk secret
//     const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     // Verify webhook signature using RAW request body
//     event = webhook.verify(req.body, {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     });
//   } catch (verificationError) {
//     console.error("Clerk webhook verification failed:", verificationError);
//     return res.status(400).json({
//       success: false,
//       message: "Webhook signature verification failed",
//     });
//   }

//   try {
//     const { type, data } = event;

//     // Handle Clerk webhook events
//     if (type === "user.created") {
//       await User.findOneAndUpdate(
//         { clerkId: data.id },
//         {
//           clerkId: data.id,
//           email: data.email_addresses[0].email_address,
//           name: `${data.first_name} ${data.last_name}`,
//           image: data.image_url,
//           resume: "",
//         },
//         {
//           upsert: true,
//           new: true,
//           runValidators: true,
//         }
//       );
//     }

//     if (type === "user.updated") {
//       await User.findOneAndUpdate(
//         { clerkId: data.id },
//         {
//           email: data.email_addresses[0].email_address,
//           name: `${data.first_name} ${data.last_name}`,
//           image: data.image_url,
//         },
//         {
//           new: true,
//           runValidators: true,
//         }
//       );
//     }

//     if (type === "user.deleted") {
//       await User.findOneAndDelete({
//         clerkId: data.id,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Webhook processed successfully",
//     });
//   } catch (databaseError) {
//     console.error("Clerk webhook database operation failed:", databaseError);
//     return res.status(500).json({
//       success: false,
//       message: "Database operation failed during webhook processing",
//     });
//   }
// };




// import { Webhook } from "svix";
// import User from "../models/User.js";

// // API Controller Function to Manage Clerk User with database
// export const clerkWebhooks = async (req, res) => {
//     try {
//         // Create a Svix instance with clerk webhook secret
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//         // Verify Headers
//         await whook.verify(JSON.stringify(req.body),{
//             "svix-id": req.headers["svix-id"],
//             "svix-timestamp": req.headers["svix-timestamp"],
//             "svix-signature": req.headers["svix-signature"],
//         });

//         // Getting Data from request body
//         const { data, type } = req.body

//         // Switch Cases for different Events
//         switch (type) {
//             case "user.created": {

//                 const userData = {
//                     clerkId : data.id,
//                     email: data.email_addresses[0].email_address,
//                     name: data.first_name + " " + data.last_name,
//                     Image: data.image_url,
//                     resume: ""
//                 }
//                 await User.create(userData);
//                 res.json({})
//                 break;

//             }

//             case "user.updated": {

//                 const userData = {
//                     email: data.email_addresses[0].email_address,
//                     name: data.first_name + " " + data.last_name,
//                     image: data.image_url,
//                 }
//                 await User.findByIdAndUpdate(data.clerkId, userData);
//                 res.json({})
//                 break;

//             }

//             case "user.deleted": {

//                 await User.findByIdAndDelete(data.clerkId);
//                 res.json({})
//                 break;

//             }
//             default:
//                 break;

            
//         }
        
//     } catch (error) {
//         console.error("Error in clerkWebhook:", error);
//         res.json({success: false, message: "Webhooks Error"});
//     }
// };