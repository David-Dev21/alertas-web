import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Phone, Mail, CheckCircle, Home, Info } from "lucide-react";
import { Victima } from "@/types/response/victimas";
import { calcularEdad } from "@/lib/utils";

interface Props {
  victima?: Victima;
}

export function DatosVictimas({ victima }: Props) {
  if (!victima) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
            <User className="w-5 h-5" />
            Datos de la Víctima
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <User className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No hay información de víctima disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular edad desde fechaNacimiento
  const edad = calcularEdad(victima.fechaNacimiento);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-base flex items-center">
          <Info className="size-6" />
          <span className="font-semibold ml-1">Información de la Víctima</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Perfil Principal */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
          <User className="size-7" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-foreground mb-0.5">
              {victima.nombres} {victima.apellidos}
            </h3>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>CI: {victima.cedulaIdentidad}</span>
              </div>

              {edad && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{edad} años</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="space-y-2">
          <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Contacto</h4>

          <div className="grid gap-2">
            <div className="flex items-center gap-3 p-2.5 bg-muted/50  rounded-lg border">
              <Phone className="size-4" />
              <p className="text-sm font-medium leading-tight">{victima.celular}</p>
            </div>
            {victima.correo && (
              <div className="flex items-center gap-3 p-2.5 bg-muted/50  rounded-lg border">
                <Mail className="size-4" />
                <p className="text-sm font-medium leading-tight">{victima.correo}</p>
              </div>
            )}
          </div>
        </div>

        {/* Dirección */}
        {victima.direccion && (
          <div className="space-y-2">
            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Dirección</h4>

            <div className="flex items-center gap-3 p-2.5 bg-muted/50  rounded-lg border">
              <Home className="size-6" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-0.5 leading-tight">
                  {victima.direccion.calle} {victima.direccion.numero}
                </p>
                <p className="text-sm text-muted-foreground mb-0.5 leading-tight">{victima.direccion.zona}</p>
                {victima.direccion.referencia && (
                  <p className="text-xs text-muted-foreground leading-tight">
                    <span className="font-medium">Ref:</span> {victima.direccion.referencia}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contactos de Emergencia */}
        {victima.contactosEmergencia && victima.contactosEmergencia.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Contactos de Emergencia</h4>

            <div className="space-y-2">
              {victima.contactosEmergencia.map((contacto, index) => (
                <div key={index} className="flex items-center gap-3 p-2.5 bg-muted/50 rounded-lg border">
                  <Phone className="size-4" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-tight">{contacto.nombreCompleto}</p>
                      {contacto.principal && (
                        <Badge variant="secondary" className="text-xs">
                          Principal
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-tight">{contacto.celular}</p>
                    <p className="text-xs text-muted-foreground leading-tight">
                      <span className="font-medium">Parentesco:</span> {contacto.parentesco}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
