import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {
    // Create a Svix instance with clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify Headers
    whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Getting Data from request body
    const { data, type } = JSON.parse(req.body.toString());

    // Switch Cases for different Events
    switch (type) {
      case "user.created":
        await User.create({
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
          resume: "",
        });
        break;

      case "user.updated":
        await User.findOneAndUpdate(
          { clerkId: data.id },
          {
            email: data.email_addresses[0].email_address,
            name: `${data.first_name} ${data.last_name}`,
            image: data.image_url,
          }
        );
        break;

      case "user.deleted":
        await User.findOneAndDelete({ clerkId: data.id });
        break;

      default:
        break;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ success: false });
  }
};



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