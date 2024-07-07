"use server";

export async function createTicket(form: FormData) {
  const ticket = {
    title: form.get("title"),
    price: form.get("price"),
  };
}