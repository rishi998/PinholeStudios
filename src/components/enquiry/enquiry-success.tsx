import { Button } from "@/components/ui/button";

export function EnquirySuccess({
  href,
  reference,
  onDismiss,
}: {
  href: string;
  reference: string;
  onDismiss?: () => void;
}) {
  return (
    <div className="grid gap-3 rounded-3xl border border-border bg-card p-5" role="status">
      <p className="font-medium">Saved. Reference {reference}.</p>
      <p className="text-sm text-muted-foreground">
        The request is stored on this site. It is not a confirmed booking, and WhatsApp has not been sent until you open the chat.
      </p>
      <Button nativeButton={false} variant="whatsapp" size="lg" render={<a href={href} target="_blank" rel="noopener noreferrer" />}>
        Open WhatsApp
      </Button>
      <p className="text-sm text-muted-foreground">If the chat does not open, use the button again. The reference stays on this screen.</p>
      {onDismiss ? (
        <Button type="button" variant="ghost" onClick={onDismiss}>
          Send another
        </Button>
      ) : null}
    </div>
  );
}
