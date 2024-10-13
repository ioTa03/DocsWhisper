import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
    Document,
    RecursiveCharacterTextSplitter,
  } from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";
import md5 from "md5";
export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
};
type PDFPage = {
    pageContent: string;
    metadata: {
      loc: { pageNumber: number };
    };
  };
export async function loadS3IntoPinecone(fileKey: string) {
  try {
    console.log("loadS3IntoPinecone started with fileKey:", fileKey);
    const file_name = await downloadFromS3(fileKey);
    if (!file_name) {
      throw new Error("could not download from s3");
      return;
    }
   
    const loader = new PDFLoader(file_name);
    console.log(loader)
    // dont put await here
    const pages = (await loader.load()) as PDFPage[];;
    // console.log("I am pages")
    console.log("DONE STEP 1");
    console.log(pages)
    // 2. split and segment the pdf
    // for individual pages
    const documents = await Promise.all(pages.map(prepareDocument));
    console.log("DONE STEP 2");

    // 3. vectorise and embed individual documents

    const vectors = await Promise.all(documents.flat().map(embedDocument));
    console.log("DONE STEP 3");
    console.log(vectors)
    // 4. upload to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = await client.index("docuwhisper");
    // if not is ascii char
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

    console.log("inserting vectors into pinecone");
    console.log("DONE STEP 4");
// REMOVED AWAIT HERE
   namespace.upsert(vectors);
  return documents[0];

  } catch (error) {
        throw error
  }
}
async function embedDocument(doc: Document) {
    try {
      const embeddings = await getEmbeddings(doc.pageContent);
    //   so that we can id vector within pinecone
      const hash = md5(doc.pageContent);
  
      return {
        id: hash,
        values: embeddings,
        metadata: {
          text: doc.metadata.text,
          pageNumber: doc.metadata.pageNumber,
        },
      } as PineconeRecord;
    } catch (error) {
      console.log("error embedding document", error);
      throw error;
    }
  }
  


// truncate to 36000 bytes
export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
  };

async function prepareDocument(page: PDFPage) {
    let { pageContent, metadata } = page;
    pageContent = pageContent.replace(/\n/g, "");
    // split the docs
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
      new Document({
        pageContent,
        metadata: {
          pageNumber: metadata.loc.pageNumber,
          text: truncateStringByBytes(pageContent, 36000),
        },
      }),
    ]);
    return docs;
  }