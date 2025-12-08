

export async function action({ request }: { request: Request }) {
    const body = await request.json().catch(() => null);
    const allowedDeliveryTypes = ["email", "ad", "social"];

    if (!body) {
        return Response.json( { error: "Invalid JSON body" }, { status: 400 });
    }

    const { sourceContent, deliveryType } = body;

    if (!sourceContent || !deliveryType) {
        return Response.json( { error: "Source content and delivery type are required" }, { status: 400 });
    }

    if (!allowedDeliveryTypes.includes(deliveryType)) {
        return Response.json( { error: "Invalid delivery type" }, { status: 400 });
    }

    return Response.json({ 
            result: `Mocked marketing text for ${deliveryType} based on: ${sourceContent.slice(0, 100)}...`, 
            meta: { deliveryType } 
        });
}