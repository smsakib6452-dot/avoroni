import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const INQUIRIES_FILE_PATH = path.join(process.cwd(), "src", "data", "inquiries.json");

function getInquiriesData() {
  try {
    if (!fs.existsSync(INQUIRIES_FILE_PATH)) {
      fs.writeFileSync(INQUIRIES_FILE_PATH, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const data = fs.readFileSync(INQUIRIES_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading inquiries file:", error);
    return [];
  }
}

function saveInquiriesData(data: any[]) {
  try {
    fs.writeFileSync(INQUIRIES_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing inquiries file:", error);
    return false;
  }
}

export async function GET(req: Request) {
  try {
    const inquiries = getInquiriesData();
    return NextResponse.json({ success: true, inquiries }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const isOrder = body.type === "order" || Boolean(body.product);

    if (!body.customerName || !body.phone) {
      return NextResponse.json(
        { success: false, error: "Customer name and phone number are required" },
        { status: 400 }
      );
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = isOrder ? `AVR-2026-${randomSuffix}` : `INQ-2026-${randomSuffix}`;

    const newRecord = {
      id,
      type: isOrder ? "order" : "inquiry",
      createdAt: new Date().toISOString(),
      status: "pending",
      customerName: body.customerName.trim(),
      phone: body.phone.trim(),
      email: body.email ? body.email.trim() : "",
      address: body.address ? body.address.trim() : "",
      deliveryZone: body.deliveryZone || "inside_dhaka",
      deliveryFee: typeof body.deliveryFee === "number" ? body.deliveryFee : 80,
      paymentMethod: body.paymentMethod || "cod",
      product: body.product || null,
      occasion: body.occasion || "",
      message: body.message || "",
      notes: body.notes || "",
      totalAmount: typeof body.totalAmount === "number" ? body.totalAmount : 0,
    };

    const currentList = getInquiriesData();
    currentList.unshift(newRecord);
    const saved = saveInquiriesData(currentList);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to persist order to storage" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: isOrder ? "Order placed successfully" : "Inquiry submitted successfully",
        record: newRecord,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating inquiry/order:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, notes } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const currentList = getInquiriesData();
    const index = currentList.findIndex((item: any) => item.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    if (status) currentList[index].status = status;
    if (typeof notes === "string") currentList[index].notes = notes;

    saveInquiriesData(currentList);

    return NextResponse.json(
      { success: true, record: currentList[index] },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update record" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID parameter is required" },
        { status: 400 }
      );
    }

    let currentList = getInquiriesData();
    const initialLen = currentList.length;
    currentList = currentList.filter((item: any) => item.id !== id);

    if (currentList.length === initialLen) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    saveInquiriesData(currentList);

    return NextResponse.json(
      { success: true, message: "Record deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete record" },
      { status: 500 }
    );
  }
}
