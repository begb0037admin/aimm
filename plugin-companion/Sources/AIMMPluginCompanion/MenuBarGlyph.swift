import AppKit

enum MenuBarGlyph {
    static let image: NSImage = {
        let image = NSImage(size: NSSize(width: 18, height: 18))
        for encoded in [
            "iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAABSUlEQVR42pXUPUskQRCA4WfWFTEwOEwVU6MLxMTA7A4xFTZREFHZaAVDvUuOQ8xPxN9hIJtpoJG/w0T8AOHg8FwdTWqhHWfX2YKmuqa636mP7qa6ZD2+t/CQVQRkyLGCBsZwhlscYbsKpBbzA7yWjCbUK4By/MEWOgn4OfZ/wVA/SD0W7MafHwuRPIc+l9DLUsnwgjauMRJ2V14j2r+fRQPfMIGvUdg0kk7opbLWjmMq5muxcDHs2QT2P/SP8A2lEWRYwD1+RRrr4R8NPY2bgOwUIamxnxTzdwGygEnMYLMMUitAOnjCFebDtxG+7yX73kmjUMA89A32wl6NtcP9zk07atJJUssT4M9CN3vKRaG13fEU+i66mfVKqXt6TzAXoK7kkcYhLvEvoH2l2eNCHgzwzGhFJM2oxSmOsZx0p14F9BCwQR6zD/IGKKdme7yeD+UAAAAASUVORK5CYII=",
            "iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAC2ElEQVR42rWYO2sUURiGn5ndTRBFsVB/gqWF4HXXjdjaeEOxsLI3uEIKe6v8BvGSNDZCECRoCosYERFS2okY0AiJm10ImN0Zm/fAx2EmO9cDh9mdyznPvOe7nYF6WwA0vd7QeYCWjjPAb2CpTpjGhOtTOnaALSAGBkFNqqAJjgJXgFPAIeAP8Bn4AOwBXeCNrvWBa3XAOKAesCEwv68Dc4KIgR0pVTlMqN8vzeQjqeH62IPblFLWpiqFWdRE/4AoRaExsKvrs55N1QYTT+hOqS/AtLfcldhMHhgfqpvRMye2UFI/LwATy6Yi4LGzobAkTAScBO5p8FZBlY+7UFEGKBLUNynUElTeFgPDKow51Jq7dV8osGwjHa9rjGYZmKT/Czm9LAJ+AYezeplLjvZG9xbngGXgtrkvK1Sk5Y2Bu0U9zE7aBrZNHHGgWZSKzFI9ygrjFDkB3PGiaNvkoD5wyQTHYAKUVaaXx24c8Vs9vKxz5w3MQHWMb1NpUGOjTC+vEbsias680UcZoHPTmZRBnff5NhUVhbG28iRB9p8m1Dczet9T4C/woAiMW655L9842dfMZGGC97WB98b73D3HUqAz2c68yTVJyXAFOGAmaJraeEf3fDKgQR0wfnR9J6jQwAx0bRu44CkUFIG5nzHS7hmlGlqmgQkF7SKK+DXNERXh44Qycz+l1lSG+jCF85J78KY3UZ4CKwZ+ABerTJKnzeB5nnfL9x1Y1blxFUAHC9a0LanaAV4lJOPcQO7hzZzq2ELNVYq3gBs61yxqP5F+r3pumqWNNMYzpZOzJvtHZXcO08DXBGNN6y40LNbxYcCVF7N6s919oKIEmNDEstJ7K7f+XWNH1q3tNtiGhBcJdlhZ65gc1FfZsZ6i0AbwMGGjWNk2+DLwWpF6CFzV55KWVDujTD0Q5IpKCfvZpdI21KBb5pPIVMmPUaXakmxnxrOpwFR+tgd1wvwHaxdm/vGAaw4AAAAASUVORK5CYII="
        ] {
            let data = Data(base64Encoded: encoded)!
            let representation = NSBitmapImageRep(data: data)!
            representation.size = image.size
            image.addRepresentation(representation)
        }
        image.isTemplate = true
        return image
    }()
}
