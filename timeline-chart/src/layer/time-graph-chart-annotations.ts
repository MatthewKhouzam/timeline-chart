import { TimeGraphAnnotationComponentOptions, TimeGraphAnnotationStyle } from "../components/time-graph-annotation";
import { TimeGraphAnnotationComponent } from "../components/time-graph-annotation";
import { TimeGraphElementPosition } from "../components/time-graph-component";
import { TimeGraphRow } from "../components/time-graph-row";
import { TimelineChart } from "../time-graph-model";
import { TimeGraphRowController } from "../time-graph-row-controller";
import { TimeGraphChartLayer } from "./time-graph-chart-layer";

class TimeGraphAnnotation {
    options: TimeGraphAnnotationComponentOptions;
    style: TimeGraphAnnotationStyle;
}

export class TimeGraphChartAnnotations extends TimeGraphChartLayer {

    protected annotations: Map<TimelineChart.TimeGraphAnnotation, TimeGraphAnnotationComponent>;
    protected annotationMap: Map<String, TimeGraphRow>;

    protected afterAddToContainer() {
        this.unitController.onViewRangeChanged(() => this.update());

        this.rowController.onVerticalOffsetChangedHandler(verticalOffset => {
            this.layer.position.y = -verticalOffset;
        });
    }

    protected getCoordinates(annotation: TimelineChart.TimeGraphAnnotation): TimeGraphAnnotation {
        const row = this.annotationMap.get(annotation.id);
        if (!row) {
            throw ('Orphanned annotation cannot have coordinates.')
        }
        this.annotationMap
        const relativeStartPosition = annotation.range.start - this.unitController.viewRange.start;
        const start: TimeGraphElementPosition = {
            x: this.getPixels(relativeStartPosition),
            y: (this.rowController.rowHeight / 2) + (row.displayObject.y * this.rowController.rowHeight)
        }
        const end = start;

        return { options: { start, end }, style: { symbol: 'cross', size: this.rowController.rowHeight, color: 0 } };
    }

    protected addAnnotation(annotation: TimelineChart.TimeGraphAnnotation, row: TimeGraphRow) {
        this.annotationMap.set(annotation.id, row);
        let options = this.getCoordinates(annotation);
        const annotationComponent = new TimeGraphAnnotationComponent(annotation.id, options.options, options.style);
        if (!this.annotations) {
            this.annotations = new Map();
        }
        this.annotations.set(annotation, annotationComponent);
        this.addChild(annotationComponent);
    }

    addAnnotations(annotations: TimelineChart.TimeGraphAnnotation[], rowController: TimeGraphRowController, rowId: number): void {
        if (!this.stateController) {
            throw ('Add this TimeGraphChartAnnotations to a container before adding annotations.');
        }
        
        annotations.forEach(annotation => {
            this.addAnnotation(annotation, row);
        })
    }

    update(): void {
        if (this.annotations) {
            for (const annotation of this.annotations.keys()) {
                this.updateAnnotation(annotation);
            }
        }
    }

    protected updateAnnotation(annotation: TimelineChart.TimeGraphAnnotation) {
        const coords = this.getCoordinates(annotation);
        const annotationComponent = this.annotations.get(annotation);
        if (annotationComponent) {
            annotationComponent.update(coords);
        }
    }

}