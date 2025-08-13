import gradio as gr
import PyPDF2
import os
import openai
import re
import plotly.graph_objects as go
from openai import AzureOpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class ResumeAnalyser:
    def __init__(self):
        try:
            # Get credentials from environment variables
            api_key = os.getenv("AZURE_OPENAI_API_KEY")
            endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
            api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")
            deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o")
            
            if not api_key or not endpoint:
                raise ValueError("Missing Azure OpenAI credentials. Please check your .env file.")
            
            self.client = AzureOpenAI(
                api_key=api_key,
                api_version=api_version,
                azure_endpoint=endpoint,
                azure_deployment=deployment_name
            )
            self.deployment_name = deployment_name
            print("✅ Azure OpenAI client initialized successfully!")
            
        except Exception as e:
            print(f"❌ Error initializing Azure OpenAI client: {e}")
            print("Please ensure your .env file contains the correct Azure OpenAI credentials")
            raise

    def extract_text_from_file(self, file_path):
        """Extract text from PDF or TXT files"""
        try:
            # Get the file extension
            file_extension = os.path.splitext(file_path)[1].lower()

            if file_extension == '.pdf':
                with open(file_path, 'rb') as file:
                    # Use PyPDF2.PdfReader (updated API)
                    reader = PyPDF2.PdfReader(file)
                    
                    # Create an empty string to hold the extracted text
                    extracted_text = ""

                    # Loop through each page in the PDF and extract the text
                    for page in reader.pages:
                        extracted_text += page.extract_text()
                        
                return extracted_text if extracted_text.strip() else "Could not extract text from PDF"

            elif file_extension == '.txt':
                with open(file_path, 'r', encoding='utf-8') as file:
                    return file.read()

            else:
                return "Unsupported file type. Please use PDF or TXT files."
                
        except Exception as e:
            return f"Error reading file: {str(e)}"

    def responce_from_ai(self, textjd, textcv):
        """Get AI analysis of job description and resume match"""
        try:
            job_description = self.extract_text_from_file(textjd)
            resume = self.extract_text_from_file(textcv)
            
            # Check for file reading errors
            if "Error" in job_description or "Error" in resume:
                return f"File reading error - JD: {job_description[:100]}..., Resume: {resume[:100]}..."
            
            if not job_description.strip() or not resume.strip():
                return "Error: One or both files appear to be empty or unreadable."
            
            conversation = [
                {"role": "system", "content": "You are a professional Resume Analyzer. Provide accurate, objective analysis."},
                {"role": "user", "content": f"""
Analyze the match between this job description and resume. Provide a percentage match and detailed analysis.

**Job Description:**
{job_description}

**Resume:**
{resume}

Please provide your analysis in exactly this format:
Matched Percentage: [number between 0-100]
Reason: [Brief explanation of why this percentage was assigned, highlighting key matching and missing elements]
Skills To Improve: [Specific skills the candidate should develop to better match this role]
Keywords: [Comma-separated list of matching keywords found in both documents]
"""}
            ]
            
            response = self.client.chat.completions.create(
                model=self.deployment_name,  # Use the deployment name
                messages=conversation,
                temperature=0.3,
                max_tokens=800,
                n=1,
                stop=None,
            )
            
            generated_text = response.choices[0].message.content
            print("✅ AI Analysis completed successfully!")
            print(f"Response: {generated_text[:200]}...")
            return generated_text
            
        except Exception as e:
            error_msg = f"Error in AI analysis: {str(e)}"
            print(f"❌ {error_msg}")
            return error_msg

    def matching_percentage(self, job_description_path, resume_path):
        """Process uploaded files and return analysis results"""
        try:
            if not job_description_path or not resume_path:
                return "Please upload both job description and resume files.", "", "", "", None
                
            job_description_path = job_description_path.name
            resume_path = resume_path.name

            print(f"📄 Processing files: JD: {job_description_path}, Resume: {resume_path}")

            generated_text = self.responce_from_ai(job_description_path, resume_path)

            if "Error" in generated_text:
                return generated_text, "Analysis failed", "Analysis failed", "Analysis failed", None

            # Parse the AI response
            lines = generated_text.split('\n')
            
            matched_percentage = 0
            matched_percentage_txt = "No percentage found"
            reason = "No reason provided"
            skills_to_improve = "No skills analysis provided"
            keywords = "No keywords identified"

            for line in lines:
                line = line.strip()
                if line.startswith('Matched Percentage:'):
                    match = re.search(r'\d+', line)
                    if match:
                        matched_percentage = int(match.group())
                        matched_percentage_txt = f"Match Score: {matched_percentage}%"
                elif line.startswith('Reason:'):
                    reason = line.split(':', 1)[1].strip() if ':' in line else "No detailed reason provided"
                elif line.startswith('Skills To Improve:'):
                    skills_to_improve = line.split(':', 1)[1].strip() if ':' in line else "No skills improvement suggestions"
                elif line.startswith('Keywords:'):
                    keywords = line.split(':', 1)[1].strip() if ':' in line else "No matching keywords found"

            # Create a pie chart with plotly
            if matched_percentage > 0:
                labels = ['Matched Skills', 'Skills Gap']
                values = [matched_percentage, 100 - matched_percentage]
                colors = ['#2E8B57', '#FF6B6B']  # Green for match, red for gap
                
                fig = go.Figure(data=[go.Pie(
                    labels=labels, 
                    values=values,
                    hole=0.4,  # Donut chart
                    marker_colors=colors
                )])
                
                fig.update_layout(
                    title=f'Resume Match Analysis: {matched_percentage}%',
                    annotations=[dict(text=f'{matched_percentage}%', x=0.5, y=0.5, font_size=20, showarrow=False)]
                )
            else:
                fig = None

            print(f"✅ Analysis complete! Match: {matched_percentage}%")
            return matched_percentage_txt, reason, skills_to_improve, keywords, fig
            
        except Exception as e:
            error_msg = f"Processing error: {str(e)}"
            print(f"❌ {error_msg}")
            return error_msg, "", "", "", None

    def filename(self, uploadbutton):
        """Display uploaded filename"""
        return uploadbutton.name if uploadbutton else "No file selected"

    def gradio_interface(self):
        """Create and launch the Gradio web interface"""
        with gr.Blocks(css="style.css", theme="freddyaboulton/test-blue", title="ADOPLE AI Resume Analyzer") as app:
            
            # Header
            with gr.Row():
                gr.HTML("""
                <center class="darkblue" style="text-align:center;padding:30px;">
                    <h1 style="color:#fff">ADOPLE AI</h1>
                    <h2 style="color:#fff">Resume Analyzer</h2>
                    <p style="color:#ccc">Upload job description and resume for AI-powered matching analysis</p>
                </center>
                """)   
            
            # File upload section
            with gr.Row():
                with gr.Column(scale=0.45, min_width=150):
                    gr.Markdown("### 📋 Job Description")
                    file_jd = gr.File(label="Selected JD File")
                    jobDescription = gr.UploadButton(
                        "📁 Upload Job Description",
                        file_types=[".txt", ".pdf"],
                        elem_classes="filenameshow"
                    )
                    
                with gr.Column(scale=0.45, min_width=150):
                    gr.Markdown("### 📄 Resume/CV")
                    file_resume = gr.File(label="Selected Resume File")
                    resume = gr.UploadButton(
                        "📁 Upload Resume",
                        file_types=[".txt", ".pdf"],
                        elem_classes="filenameshow"
                    )
                    
                with gr.Column(scale=0.10, min_width=150):
                    gr.Markdown("### 🔍 Analysis")
                    analyse = gr.Button("🚀 Analyze Match", variant="primary", size="lg")

            # Results section
            gr.Markdown("## 📊 Analysis Results")
            
            with gr.Row():
                with gr.Column(scale=1.0, min_width=150):
                    percentage = gr.Textbox(label="📈 Matching Score", lines=3)
                with gr.Column(scale=1.0, min_width=150):
                    reason = gr.Textbox(label="💡 Analysis Summary", lines=8)
                    
            with gr.Row():
                with gr.Column(scale=1.0, min_width=150):
                    skills = gr.Textbox(label="🎯 Skills to Develop", lines=8)
                with gr.Column(scale=1.0, min_width=150):
                    keywords = gr.Textbox(label="🔑 Matching Keywords", lines=8)
                    
            with gr.Row():
                with gr.Column(scale=1.0, min_width=150):
                    pychart = gr.Plot(label="📊 Visual Match Analysis")

            # Event handlers
            jobDescription.upload(self.filename, jobDescription, file_jd)
            resume.upload(self.filename, resume, file_resume)
            analyse.click(
                self.matching_percentage,
                inputs=[jobDescription, resume],
                outputs=[percentage, reason, skills, keywords, pychart]
            )

        print("🚀 Starting Resume Analyzer...")
        app.launch(
            share=False, 
            debug=False,
            server_name="127.0.0.1",
            server_port=7860,
            show_error=True
        )

if __name__ == "__main__":
    try:
        resume = ResumeAnalyser()
        resume.gradio_interface()
    except Exception as e:
        print(f"❌ Failed to start application: {e}")
        print("\n🔧 Troubleshooting steps:")
        print("1. Check your .env file contains correct Azure OpenAI credentials")
        print("2. Ensure all required packages are installed: pip install python-dotenv")
        print("3. Verify your Azure OpenAI deployment is active")