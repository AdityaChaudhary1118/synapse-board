import { BaseBoxShapeUtil, HTMLContainer, T, TLBaseShape } from 'tldraw'

// 1. Define what the shape looks like in data
export type PreviewShape = TLBaseShape<'preview', { html: string; w: number; h: number }>

// 2. Define the "Util" that renders it
export class PreviewShapeUtil extends BaseBoxShapeUtil<PreviewShape> {
	static override type = 'preview' as const

    // Validate that the data is correct
	override getDefaultProps(): PreviewShape['props'] {
		return { html: '', w: 400, h: 400 }
	}

    // This renders the actual "Website" inside the box
	override component(shape: PreviewShape) {
		return (
			<HTMLContainer className="pointer-events-auto" style={{ overflow: 'hidden' }}>
				<div
                    // Stop mouse events from stealing focus unless interacting
					onPointerDown={(e) => e.stopPropagation()}
					style={{ width: '100%', height: '100%', background: 'white', border: '1px solid black' }}
				>
                    {/* The Magic Frame that runs the code */}
					<iframe
						srcDoc={shape.props.html}
						width="100%"
						height="100%"
						style={{ border: 'none' }}
						sandbox="allow-scripts" // Security: Only allow scripts, no popups
					/>
				</div>
			</HTMLContainer>
		)
	}

	override indicator(shape: PreviewShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}