import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSupabase } from "@/lib/supabase";

const INQUIRIES_FILE_PATH = path.join(process.cwd(), "src", "data", "inquiries.json");

function getLocalInquiriesData(): any[] {
  try {
    if (!fs.existsSync(INQUIRIES_FILE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(INQUIRIES_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.warn("Could not read local inquiries file:", error);
    return [];
  }
}

function saveLocalInquiriesData(data: any[]) {
  try {
    fs.writeFileSync(INQUIRIES_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.warn("Local inquiries file write skipped or read-only:", error);
    return false;
  }
}

export async function GET() {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        // Map database row to standard frontend structure
        const inquiries = data.map((row) => ({
          id: row.id,
          type: row.type || "order",
          status: row.status || "pending",
          customerName: row.customer_name || row.customerName || "",
          phone: row.phone || "",
          email: row.email || "",
          address: row.address || "",
          deliveryZone: row.delivery_zone || row.deliveryZone || "inside_dhaka",
          deliveryFee: typeof row.delivery_fee === "number" ? row.delivery_fee : 80,
          paymentMethod: row.payment_method || row.paymentMethod || "cod",
          product: row.product || null,
          occasion: row.occasion || "",
          message: row.message || "",
          notes: row.notes || "",
          totalAmount: typeof row.total_amount === "number" ? row.total_amount : 0,
          createdAt: row.created_at || row.createdAt || new Date().toISOString(),
          ...(row.data || {}),
        }));

        return NextResponse.json({ success: true, inquiries, source: "supabase" }, { status: 200 });
      }
    } catch (err) {
      console.warn("Supabase inquiries fetch failed, falling back to local:", err);
    }
  }

  const inquiries = getLocalInquiriesData();
  return NextResponse.json({ success: true, inquiries, source: "local" }, { status: 200 });
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

    let savedToCloud = false;
    const supabase = getSupabase();

    if (supabase) {
      try {
        const { error } = await supabase.from("inquiries").insert({
          id: newRecord.id,
          type: newRecord.type,
          status: newRecord.status,
          customer_name: newRecord.customerName,
          phone: newRecord.phone,
          email: newRecord.email,
          address: newRecord.address,
          delivery_zone: newRecord.deliveryZone,
          delivery_fee: newRecord.deliveryFee,
          payment_method: newRecord.paymentMethod,
          product: newRecord.product,
          occasion: newRecord.occasion,
          message: newRecord.message,
          notes: newRecord.notes,
          total_amount: newRecord.totalAmount,
          created_at: newRecord.createdAt,
          data: newRecord,
        });

        if (!error) {
          savedToCloud = true;
        } else {
          console.error("Supabase insert inquiry error:", error);
        }
      } catch (cloudErr) {
        console.error("Supabase inquiry insert exception:", cloudErr);
      }
    }

    // Try saving locally as well (sync fallback)
    const currentList = getLocalInquiriesData();
    currentList.unshift(newRecord);
    saveLocalInquiriesData(currentList);

    return NextResponse.json(
      {
        success: true,
        message: isOrder ? "Order placed successfully" : "Inquiry submitted successfully",
        record: newRecord,
        storage: savedToCloud ? "supabase" : "local",
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

    const supabase = getSupabase();
    if (supabase) {
      try {
        const updatePayload: Record<string, any> = {};
        if (status) updatePayload.status = status;
        if (typeof notes === "string") updatePayload.notes = notes;

        await supabase.from("inquiries").update(updatePayload).eq("id", id);
      } catch (err) {
        console.warn("Supabase update error:", err);
      }
    }

    const currentList = getLocalInquiriesData();
    const index = currentList.findIndex((item: any) => item.id === id);

    if (index !== -1) {
      if (status) currentList[index].status = status;
      if (typeof notes === "string") currentList[index].notes = notes;
      saveLocalInquiriesData(currentList);
      return NextResponse.json({ success: true, record: currentList[index] }, { status: 200 });
    }

    return NextResponse.json(
      { success: true, message: "Record updated" },
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

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from("inquiries").delete().eq("id", id);
      } catch (err) {
        console.warn("Supabase delete error:", err);
      }
    }

    let currentList = getLocalInquiriesData();
    currentList = currentList.filter((item: any) => item.id !== id);
    saveLocalInquiriesData(currentList);

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
