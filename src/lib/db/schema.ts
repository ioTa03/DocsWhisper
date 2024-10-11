
import {pgTable,text, serial,timestamp,varchar,integer,pgEnum} from 'drizzle-orm/pg-core'
export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]);

export const chats=pgTable('chats',{
    id:serial('id').primaryKey(),
    pdfName : text('pdf_name').notNull(),
    createdAt:timestamp('created_At').notNull().defaultNow(),
    pdfUrl:text('pdf_url').notNull(),
    userId:varchar('user_id',{length:256}).notNull(),
    // filekey used to retrieve the file from s3.. 
    fileKey:text('file_key').notNull(),
})

// pg-postgress table

export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    // each mssg belong to a chat
    chatId: integer("chat_id")
      .references(() => chats.id)
      .notNull(),
    //   content
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    // user or system
    role: userSystemEnum("role").notNull(),
  });

//   drizzle orm interacts with the db
//   drizzle kit provides us with utility fn to create migration and db is synced up with schema
